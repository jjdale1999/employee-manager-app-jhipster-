package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Salary;
import com.mycompany.myapp.repository.SalaryRepository;
import com.mycompany.myapp.service.SalaryService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Salary}.
 */
@RestController
@RequestMapping("/api")
public class SalaryResource {

    private final Logger log = LoggerFactory.getLogger(SalaryResource.class);

    private static final String ENTITY_NAME = "salary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalaryService salaryService;

    private final SalaryRepository salaryRepository;

    public SalaryResource(SalaryService salaryService, SalaryRepository salaryRepository) {
        this.salaryService = salaryService;
        this.salaryRepository = salaryRepository;
    }

    /**
     * {@code POST  /salaries} : Create a new salary.
     *
     * @param salary the salary to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new salary, or with status {@code 400 (Bad Request)} if the salary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/salaries")
    public ResponseEntity<Salary> createSalary(@Valid @RequestBody Salary salary) throws URISyntaxException {
        log.debug("REST request to save Salary : {}", salary);
        if (salary.getId() != null) {
            throw new BadRequestAlertException("A new salary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Salary result = salaryService.save(salary);
        return ResponseEntity
            .created(new URI("/api/salaries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /salaries/:id} : Updates an existing salary.
     *
     * @param id the id of the salary to save.
     * @param salary the salary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salary,
     * or with status {@code 400 (Bad Request)} if the salary is not valid,
     * or with status {@code 500 (Internal Server Error)} if the salary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/salaries/{id}")
    public ResponseEntity<Salary> updateSalary(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Salary salary
    ) throws URISyntaxException {
        log.debug("REST request to update Salary : {}, {}", id, salary);
        if (salary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salaryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Salary result = salaryService.save(salary);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salary.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /salaries/:id} : Partial updates given fields of an existing salary, field will ignore if it is null
     *
     * @param id the id of the salary to save.
     * @param salary the salary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salary,
     * or with status {@code 400 (Bad Request)} if the salary is not valid,
     * or with status {@code 404 (Not Found)} if the salary is not found,
     * or with status {@code 500 (Internal Server Error)} if the salary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/salaries/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Salary> partialUpdateSalary(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Salary salary
    ) throws URISyntaxException {
        log.debug("REST request to partial update Salary partially : {}, {}", id, salary);
        if (salary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salaryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Salary> result = salaryService.partialUpdate(salary);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salary.getId().toString())
        );
    }

    /**
     * {@code GET  /salaries} : get all the salaries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of salaries in body.
     */
    @GetMapping("/salaries")
    public List<Salary> getAllSalaries() {
        log.debug("REST request to get all Salaries");
        return salaryService.findAll();
    }

    /**
     * {@code GET  /salaries/:id} : get the "id" salary.
     *
     * @param id the id of the salary to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the salary, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/salaries/{id}")
    public ResponseEntity<Salary> getSalary(@PathVariable Long id) {
        log.debug("REST request to get Salary : {}", id);
        Optional<Salary> salary = salaryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(salary);
    }

    /**
     * {@code DELETE  /salaries/:id} : delete the "id" salary.
     *
     * @param id the id of the salary to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/salaries/{id}")
    public ResponseEntity<Void> deleteSalary(@PathVariable Long id) {
        log.debug("REST request to delete Salary : {}", id);
        salaryService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
