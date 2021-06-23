package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.JobLevel;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Salary.
 */
@Entity
@Table(name = "salary")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Salary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "joblevel", nullable = false, unique = true)
    private JobLevel joblevel;

    @Column(name = "salary")
    private Long salary;

    @OneToMany(mappedBy = "joblevel")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "manager", "department", "job", "joblevel" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Salary id(Long id) {
        this.id = id;
        return this;
    }

    public JobLevel getJoblevel() {
        return this.joblevel;
    }

    public Salary joblevel(JobLevel joblevel) {
        this.joblevel = joblevel;
        return this;
    }

    public void setJoblevel(JobLevel joblevel) {
        this.joblevel = joblevel;
    }

    public Long getSalary() {
        return this.salary;
    }

    public Salary salary(Long salary) {
        this.salary = salary;
        return this;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public Salary employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Salary addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setJoblevel(this);
        return this;
    }

    public Salary removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setJoblevel(null);
        return this;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setJoblevel(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setJoblevel(this));
        }
        this.employees = employees;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Salary)) {
            return false;
        }
        return id != null && id.equals(((Salary) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Salary{" +
            "id=" + getId() +
            ", joblevel='" + getJoblevel() + "'" +
            ", salary=" + getSalary() +
            "}";
    }
}
